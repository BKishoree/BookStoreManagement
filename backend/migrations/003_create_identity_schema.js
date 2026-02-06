exports.up = (pgm) => {
  pgm.createSchema('identity', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropSchema('identity', { cascade: true });
};