from diagrams import Diagram, Cluster

from diagrams.ibm.general import Cloudant

with Diagram("Open Harvest", show=True, direction="TB"):
    with Cluster("Backend"):
