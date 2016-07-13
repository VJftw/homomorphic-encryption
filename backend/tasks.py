from invoke import task
from docker import Client
from idflow import Utils, Docker
import os

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

@task
def test(ctx):
    pass
