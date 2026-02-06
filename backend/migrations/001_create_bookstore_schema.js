exports.up = (pgm) => {
  pgm.createSchema('bookstore', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropSchema('bookstore', { cascade: true });
};