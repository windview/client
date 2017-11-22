

let WindFarm = new function() {

  this.getWindFarmById = (fid, farms) => {
    return farms.find((farm)=>{ return farm.properties.id === fid; });
  }
}();

export default WindFarm;
