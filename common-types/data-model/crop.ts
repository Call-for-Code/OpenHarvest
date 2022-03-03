export interface Crop {
    _id?: string,
    type: string,
    name: string,
    planting_season: Date[],
    time_to_harvest: number,
    is_ongoing: boolean
}
