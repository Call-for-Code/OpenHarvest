export interface Farmer {
	_id: string;
    _rev: string;
	type: string;
	name: string;
	mobile: string;
	land_ids: number[];
}

export interface LandLevels {
	_id: string;
    _rev: string;
	type: string;
	level_type: string;
	bbox: number[][];
}

export interface Crop {
	_id: string;
    _rev: string;
	type: string;
	name: string;
	planting_season: string[];
	is_ongoing: string;
}

export interface LandCrops {
	type: string;
	name: string;
	planted: string;
	harvested: string;
	farmer: string;
	crop: Crop;
}

export interface Land {
	_id: string;
    _rev: string;
	type: string;
	fid: number;
    crops: LandCrops[];
}

