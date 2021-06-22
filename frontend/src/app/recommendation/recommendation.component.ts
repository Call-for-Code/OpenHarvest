import { Component, OnInit } from "@angular/core";
import { BaseModal, ModalService } from "carbon-components-angular";
import { Crop, CropService } from "../crop/crop.service";
import { CropRecommendationResult, RecommendationService } from "./recommendation.service";

@Component({
  selector: "app-recommendation",
  templateUrl: "./recommendation.component.html",
  styleUrls: ["./recommendation.component.scss"]
})
export class RecommendationComponent extends BaseModal implements OnInit {
  lots: Array<Object>;
  crops: Array<Object>;
  plantDate = new Date();
  selectedCrop = [];
  cropRecomGauge = [];

  constructor(protected modalService: ModalService,
              private cropService: CropService,
              private service: RecommendationService) {
    super();

  }

  ngOnInit(): void {
    this.setCrops();
  }

  recommend() {
    const requestData = {
      plantDate: this.plantDate,
      crops: this.selectedCrop.map(val => val.value.name)
    };

    this.service.recommend(requestData)
        .then(value =>  this.cropRecomGauge = value.map(recom => {
          return {
            crop: recom.crop,
            data: this.getGaugeData(recom),
            options: this.getGaugeOptions(recom)
          };
        }));
  }

  isFormInvalid() {
    return !this.selectedCrop || this.selectedCrop.length === 0 ||
           !this.plantDate;
  }

  setCrops() {
    this.cropService.getAllCrops().then((crops: Crop[]) => {
      const data = [];
      crops.forEach(crop => {
        data.push({content: crop.name, selected: false, value: crop});
      });

      this.crops = data;
    });
  }

  getGaugeData(cropRecom: CropRecommendationResult) {
    return [{
      group: "value",
      value: cropRecom.score * 10
    },
      // {
      //   group: "Shortlist",
      //   value: cropRecom.shortlistScore * 10
      // },
      // {
      //   group: "In Season Planting",
      //   value: cropRecom.inSeasonScore * 10
      // },
      // {
      //   group: "Planted Area",
      //   value: cropRecom.plantedAreaScore * 10
      // },
      // {
      //   group: "Yield Forecast",
      //   value: cropRecom.yieldForecastScore * 10
      // },
    ];
  }

  getGaugeOptions(cropRecom: CropRecommendationResult) {
    return {
      "title": cropRecom.crop,
      "resizable": false,
      "height": "200px",
      "width": "150px",
      "gauge": {
        "showPercentageSymbol": false,
        "type": "full"
      },
      "color": {
        "scale": {
          "value": "#198038"
        }
      }
    };
  }
}
