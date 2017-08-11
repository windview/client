

let WindFarm = new function() {

  this.getWindFarmById = (fid, farms) => {
    return farms.find((farm)=>{ return farm.properties.fid === fid; });
  }
}();

export default WindFarm;
