from invoke import task
from docker import Client
from idflow import Docker
import os
import shutil
import json

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

@task
def appengine_deploy(ctx):
    """
    appcfg.py
    """
    # Docker.clean(cli, ["appengine/client-dist"])
    # print("\nBuilding Client\n")
    # os.chdir("client")
    # ctx.run("invoke build_prod")
    #
    # print("\nCopying built Client\n")
    # shutil.copytree("dist", "../appengine/client-dist")

    print("\nCopying Credentials file\n")
    Docker.clean(cli, ["appengine/gae-creds"])

    # os.chdir("../appengine")
    os.makedirs("{0}/appengine/gae-creds".format(os.getcwd()))
    shutil.copy(os.getenv("GAEServiceCredentialsFile"), "appengine/gae-creds/GAEServiceCredentials.json")
    with open("appengine/gae-creds/GAEServiceCredentials.json") as json_data:
        creds = json.loads(json_data.read())

    print("\nUploading to Google AppEngine\n")
    Docker.build(cli,
        dockerfile="appengine/Dockerfile.appengine",
        tag="vjftw/gae"
    )
    print(creds['client_email'])
    cmd1 = "gcloud auth activate-service-account {0} --key-file /app/appengine/gae-creds/GAEServiceCredentials.json".format(creds['client_email'])
    cmd2 = "gcloud config set account {0}".format(creds['client_email'])
    cmd3 = "cd appengine && appcfg.py -A homomorphic-encryption -V v1 update ."

    Docker.run(cli,
        tag="vjftw/gae",
        command='/bin/sh -c "{0} && {1} && {2}"'.format(cmd1, cmd2, cmd3),
        volumes=[
            "{0}:/app".format(os.getcwd())
        ],
        working_dir="/app"
    )

    # ctx.run("appcfg.py -A homomorphic-encryption -V v1 update ./")
    pass

@task
def appengine_dev(ctx):
    """
    goapp serve
    """

    pass
