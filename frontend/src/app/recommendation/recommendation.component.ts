import { Component, OnInit } from "@angular/core";
import { BaseModal, ModalService } from "carbon-components-angular";
import { Crop, CropService } from "../crop/crop.service";
import { CropRecommendationResult, RecommendationService } from "./recommendation.service";
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
​
@Component({
  selector: "app-recommendation",
  templateUrl: "./recommendation.component.html",
  styleUrls: ["./recommendation.component.scss"]
})
​
export class RecommendationComponent extends BaseModal implements OnInit {
  form: FormGroup;
  lots: Array<Object>;
  cropsData: Array<Crop>;
  selectedCrop = [];
  cropRecomGauge = [];
  loadingCrops = true;
  loadingRecom: boolean = false;
​
  constructor(protected modalService: ModalService,
              private cropService: CropService,
              private service: RecommendationService,
              private formBuilder: FormBuilder) {
    super();
    
    this.form = this.formBuilder.group({
      crops: this.formBuilder.group({}),
      plantDate: new FormControl(new Date(), Validators.required)
    });
​  }
​
​
  ngOnInit(): void {
    this.setCrops();
  }
​
  recommend() {
    this.loadingRecom = true;
    const values = this.form.get('crops').value;
    const selectedCrops = Object.keys(values).filter(value => values[value]); //Filter selected keys
    const requestData = {
      plantDate: this.getPlantDate(),
      crops: selectedCrops
    };
​
    this.service.recommend(requestData)
        .then(value =>  this.cropRecomGauge = value.map(recom => {
          this.loadingRecom = false;
          return {
            crop: recom.crop,
            data: this.getGaugeData(recom),
            options: this.getGaugeOptions(recom)
          };
        }));
  }
​
  isFormInvalid() {
    return this.form.invalid || this.noCropSelected();
  }

  noCropSelected() {
    const values = this.form.get('crops').value;
    const selectedCrops = Object.keys(values).filter(value => values[value]);

    return selectedCrops.length === 0;
  }
​
  setCrops() {
    this.loadingCrops = true;
    this.cropService.getAllCrops().then((crops: Crop[]) => {
      const cropsCheckBoxGroup = <FormGroup> this.form.get('crops');
      this.cropsData = crops;
      crops.forEach((crop) => cropsCheckBoxGroup.addControl(crop.name, new FormControl(false)));
    
      this.loadingCrops = false;
    });
  }
​
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
​
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

  getPlantDate() {
    return this.form.get('plantDate').value[0];
  }
}