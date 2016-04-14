from invoke import task
from docker import Client
import json
import os
from subprocess import check_output
import getpass

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

def print_line(line):
    if "stream" in line:
        print(line["stream"])
    elif "status" in line:
        o = line["status"]
        if "progress" in line:
            o += " " + line["progress"]
        if "id" in line:
            o = line["id"] + " " + o
        print(o)
    else:
        print(line)

def build(dockerfile, tag):
    for line in cli.build(
        dockerfile=dockerfile,
        pull=True,
        path=".",
        rm=True,
        tag=tag
    ):
        line = line.decode('utf-8')
        line = json.loads(line)
        print_line(line)

def get_branch():
    if os.getenv('GIT_BRANCH'):
        # Travis
        branch = os.getenv('GIT_BRANCH')
    elif os.getenv('BRANCH_NAME'):
        # Jenkins 2
        branch = os.getenv('BRANCH_NAME')
    else:
        branch = check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip()

    return branch.decode('utf-8').replace("/", "_")

def get_version():
    try:
        return check_output("git describe --tags".split(" ")).decode('utf-8').strip()
    except CalledProcessError as e:
        return check_output("git rev-parse --short HEAD".split(" ")).decode('utf-8').strip()

def execute(container_id, cmd):
    print("Executing: {0}".format(cmd))
    execute = cli.exec_create(
        container=container_id,
        cmd=cmd,
        user='root' if CI else 'app'
    )

    for line in cli.exec_start(
        exec_id=execute.get('Id'),
        stream=True
    ):
        line = line.decode('utf-8')
        print(line)

    inspect = cli.exec_inspect(execute.get('Id'))
    exit_code = inspect.get('ExitCode')
    if exit_code != 0:
        cli.stop(container_id)
        cli.remove_container(container_id)
        raise Exception("Exit Code: {0}\n{1}".format(exit_code, inspect))

def clean(objs):
    cli.pull("alpine:latest")
    container = cli.create_container(
        image=dev_container_name,
        volumes=[
            '{0}:/app'.format(os.getcwd())
        ],
        working_dir='/app',
        host_config=cli.create_host_config(binds=[
            '{0}:/app'.format(os.getcwd())
        ]),
        command='/bin/sh -c "rm -rf {0}"'.format(" ".join(objs))
    )
    print('/bin/sh -c "rm -rf {0}"'.format(" ".join(objs)))
    response = cli.start(container=container.get('Id'))
    cli.wait(container=container.get('Id'), timeout=600)
    print(response)
    cli.remove_container(container.get('Id'))

CI = True if os.getenv('CI') else False
repository = 'vjftw/homomorphic-encryption'
prefix = 'client'
branch = get_branch()
version = get_version()
dev_container_name = "{0}:{1}-{2}-dev".format(repository, prefix, branch)
build_container_tag = "{0}-{1}-{2}".format(prefix, branch, version)
build_container_name = "{0}:{1}".format(repository, build_container_tag)
branch_container_tag = "{0}-{1}".format(prefix, branch)
branch_container_name = "{0}:{1}".format(repository, branch_container_tag)

print(dev_container_name)
print(build_container_name)
print(branch_container_name)

@task
def test():
    print("# Testing!")
    build("Dockerfile.dev", dev_container_name)

    print("Starting Development container")
    container = cli.create_container(
        image=dev_container_name,
        volumes=[
            '{0}:/app'.format(os.getcwd())
        ],
        host_config=cli.create_host_config(binds=[
            '{0}:/app'.format(os.getcwd())
        ])
    )
    response = cli.start(container=container.get('Id'))
    # print(response)

    execute(container.get('Id'), "node --version")
    execute(container.get('Id'), "npm --version")

    execute(container.get('Id'), "npm install")
    execute(container.get('Id'), "npm run postinstall")

    execute(container.get('Id'), "npm run lint")
    execute(container.get('Id'), "npm run test")

    cli.stop(container.get('Id'))
    cli.remove_container(container.get('Id'))

@task
def build_prod():
    print("# Building!")
    build("Dockerfile.dev", dev_container_name)

    print("Starting Development container")
    prod_api_url = 'api.homomorphic-encryption.vjpatel.me'
    prod_backend_url = 'backend.homomorphic-encryption.vjpatel.me'

    container = cli.create_container(
        image=dev_container_name,
        volumes=[
            '{0}:/app'.format(os.getcwd())
        ],
        host_config=cli.create_host_config(binds=[
            '{0}:/app'.format(os.getcwd())
        ]),
        environment={
            'NODE_ENV': 'production',
            'CLIENT_API_ADDRESS': prod_api_url,
            'CLIENT_BACKEND_ADDRESS': prod_backend_url
        }
    )

    response = cli.start(container=container.get('Id'))

    execute(container.get('Id'), "node --version")
    execute(container.get('Id'), "npm --version")

    execute(container.get('Id'), "npm install")
    execute(container.get('Id'), "npm run postinstall")

    execute(container.get('Id'), "npm run build:prod")

    cli.stop(container.get('Id'))
    cli.remove_container(container.get('Id'))

    print("# Building Production container!")
    build("Dockerfile.app", build_container_name)

    print("# Tagging as {0}".format(branch_container_name))
    cli.tag(
        image=build_container_name,
        repository=repository,
        tag=branch_container_tag
    )

    clean(['dist'])

@task
def clean():
    clean(['node_modules', 'doc', 'typings', 'coverage', 'dist'])

@task
def push_prod():
    if CI:
        email = os.getenv('DOCKER_EMAIL')
        username = os.getenv('DOCKER_USERNAME')
        password = os.getenv('DOCKER_PASSWORD')
    else:
        email = input('Docker email:')
        username = input('Docker username:')
        password = getpass.getpass('Docker password:')
    cli.login(
        username=username,
        email=email,
        password=password,
        registry='https://index.docker.io/v1/'
    )

    print("# Pushing to Registry")
    for line in cli.push(build_container_name, stream=True):
        line = line.decode('utf-8')
        line = json.loads(line)
        print_line(line)

    for line in cli.push(branch_container_name, stream=True):
        line = line.decode('utf-8')
        line = json.loads(line)
        print_line(line)
