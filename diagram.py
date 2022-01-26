from diagrams import Diagram, Cluster

from diagrams.ibm.general import Cloudant
from diagrams.programming.language import Javascript
from diagrams.generic.compute import Rack

with Diagram("Open Harvest - Runtime", show=True, direction="TB"):

    with Cluster("IBM Cloud Services"):
        cloudant_app_db = Cloudant("Application-DB")
        cloudant_lot_areas = Cloudant("Lot-Areas")

    with Cluster("Node.js Backend"):
        cloudantSDK = Javascript("CloudantSDK")
        express




