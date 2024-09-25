const mongoose = require('mongoose');

const neoSchema = new mongoose.Schema({
  neo_reference_id: String,
  name: String,
  nasa_jpl_url: String,
  absolute_magnitude_h: Number,
  estimated_diameter: {
    kilometers: {
      min: Number,
      max: Number
    }
  },
  is_potentially_hazardous_asteroid: Boolean,
  close_approach_data: [{
    close_approach_date: Date,
    miss_distance: {
      kilometers: Number
    },
    relative_velocity: {
      kilometers_per_second: Number
    }
  }],
  orbital_data: {
    orbit_id: String,
    orbit_determination_date: Date,
    first_observation_date: Date,
    last_observation_date: Date,
    data_arc_in_days: Number,
    observations_used: Number,
    orbit_uncertainty: String,
    minimum_orbit_intersection: Number,
    jupiter_tisserand_invariant: Number,
    epoch_osculation: Date,
    eccentricity: Number,
    semi_major_axis: Number,
    inclination: Number,
    ascending_node_longitude: Number,
    orbital_period: Number,
    perihelion_distance: Number,
    perihelion_argument: Number,
    aphelion_distance: Number,
    perihelion_time: Date,
    mean_anomaly: Number,
    mean_motion: Number,
    equinox: String
  }
});

neoSchema.index({ name: 'text', neo_reference_id: 'text' });

module.exports = mongoose.model('NEO', neoSchema);