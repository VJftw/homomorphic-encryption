from invoke import task
from docker import Client
from idflow import Docker
import os
import shutil

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

    print("\nUploading to Google AppEngine\n")
    # os.chdir("../appengine")
    ctx.run("appcfg.py -A homomorphic-encryption -V v1 update ./")
    pass

@task
def appengine_dev(ctx):
    """
    goapp serve
    """

    pass
