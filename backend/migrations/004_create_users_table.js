exports.up = (pgm) => {
  pgm.createTable({ schema: 'identity', name: 'users' }, {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: { type: 'text', notNull: true },
    email: { type: 'text', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    phonenumber: { type: 'text' },
    accounttype: {
      type: 'text',
      notNull: true,
      // check: `'accounttype' IN ('ADMIN', 'INDIVIDUAL')`,
    },
    active: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    created_by: { type: 'uuid', 
      null: true,
     },
  });
};

exports.down = (pgm) => {
  pgm.dropTable({ schema: 'identity', name: 'users' });
};
