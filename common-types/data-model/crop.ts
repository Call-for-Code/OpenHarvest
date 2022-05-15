export default interface Crop {
    _id?: string,
    type: string,
    name: string,
    planting_season: number[],
    time_to_harvest: number,
    yield_per_sqm: number,
    is_ongoing: boolean
}
