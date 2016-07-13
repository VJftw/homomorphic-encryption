from invoke import task
from docker import Client
from idflow import Utils, Docker, Flow
import os

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

flow = Flow(
    repository="vjftw/homomorphic-encryption",
    prefix="backend"
)

print(flow.get_build_container_name())

@task
def test(ctx):
    Docker.build(cli,
        dockerfile='Dockerfile.dev',
        tag="{0}-dev".format(flow.get_branch_container_name())
    )

    Docker.run(cli,
        tag="{0}-dev".format(flow.get_branch_container_name()),
        command='glide install',
        volumes=[
            "{0}:/go/src/github.com/vjftw/homomorphic-encryption/backend".format(os.getcwd())
        ],
        working_dir="/go/src/github.com/vjftw/homomorphic-encryption/backend",
        environment={}
    )
    Docker.run(cli,
        tag="{0}-dev".format(flow.get_branch_container_name()),
        command='/bin/sh -c "go test -v $(glide novendor)"',
        volumes=[
            "{0}:/go/src/github.com/vjftw/homomorphic-encryption/backend".format(os.getcwd())
        ],
        working_dir="/go/src/github.com/vjftw/homomorphic-encryption/backend",
        environment={}
    )
    pass
