from invoke import task

cli = Client(base_url='unix://var/run/docker.sock', timeout=600)

@task
def appengine_deploy(ctx):
    """
    appcfg.py
    """
    pass

@task
def appengine_dev(ctx):
    """
    goapp serve
    """
    pass
