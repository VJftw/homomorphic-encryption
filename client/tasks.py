from invoke import task
from docker import Client
from idflow import Utils, Docker, Flow
import os

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

flow = Flow(
    repository='vjftw/homomorphic-encryption',
    prefix='client'
)

@task
def test(ctx):
    print("# Testing!")
    Docker.build(cli,
        dockerfile='Dockerfile.dev',
        tag="{0}-dev".format(flow.get_branch_container_name())
    )

    print("Starting Development container")
    container = cli.create_container(
        image="{0}-dev".format(flow.get_branch_container_name()),
        volumes=[
            '{0}:/app'.format(os.getcwd())
        ],
        host_config=cli.create_host_config(binds=[
            '{0}:/app'.format(os.getcwd())
        ])
    )
    response = cli.start(container=container.get('Id'))
    # print(response)

    Docker.execute(cli, container.get('Id'), "node --version")
    Docker.execute(cli, container.get('Id'), "npm --version")
    Docker.execute(cli, container.get('Id'), "npm install")
    Docker.execute(cli, container.get('Id'), "npm run postinstall")
    Docker.execute(cli, container.get('Id'), "npm run lint")
    Docker.execute(cli, container.get('Id'), "npm run test")

    cli.stop(container.get('Id'))
    cli.remove_container(container.get('Id'))

@task
def build_prod(ctx):
    print("# Building!")
    Docker.build(cli,
        dockerfile='Dockerfile.dev',
        tag="{0}-dev".format(flow.get_branch_container_name())
    )

    print("Starting Development container")
    prod_api_url = 'homomorphic-encryption.appspot.com'
    prod_backend_url = 'homomorphic-encryption.appspot.com'

    container = cli.create_container(
        image="{0}-dev".format(flow.get_branch_container_name()),
        volumes=[
            '{0}:/app'.format(os.getcwd())
        ],
        host_config=cli.create_host_config(binds=[
            '{0}:/app'.format(os.getcwd())
        ]),
        environment={
            'CLIENT_API_ADDRESS': prod_api_url,
            'CLIENT_BACKEND_ADDRESS': prod_backend_url
        }
    )

    response = cli.start(container=container.get('Id'))

    Docker.execute(cli, container.get('Id'), "node --version")
    Docker.execute(cli, container.get('Id'), "npm --version")

    Docker.execute(cli, container.get('Id'), "npm install")
    Docker.execute(cli, container.get('Id'), "npm run postinstall")

    Docker.execute(cli, container.get('Id'), "npm run build:prod")

    cli.stop(container.get('Id'))
    cli.remove_container(container.get('Id'))

    print("# Building Production container!")
    Docker.build(cli, "Dockerfile.app", flow.get_build_container_name())

@task
def pre_clean(ctx):
    Docker.clean(cli,
        ['node_modules', 'doc', 'typings', 'coverage', 'dist']
    )

# @task
# def push_prod():
#     if CI:
#         email = os.getenv('DOCKER_EMAIL')
#         username = os.getenv('DOCKER_USERNAME')
#         password = os.getenv('DOCKER_PASSWORD')
#     else:
#         email = input('Docker email:')
#         username = input('Docker username:')
#         password = getpass.getpass('Docker password:')
#     cli.login(
#         username=username,
#         email=email,
#         password=password,
#         registry='https://index.docker.io/v1/'
#     )
#
#     print("# Pushing to Registry")
#     for line in cli.push(build_container_name, stream=True):
#         line = line.decode('utf-8')
#         line = json.loads(line)
#         print_line(line)
#
#     for line in cli.push(branch_container_name, stream=True):
#         line = line.decode('utf-8')
#         line = json.loads(line)
#         print_line(line)
