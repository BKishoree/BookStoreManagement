exports.up = (pgm) => {
    pgm.createExtension('pgcrypto', { ifNotExists: true });

    pgm.createTable(
      { schema: 'bookstore', name: 'books' }, {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'text',
    },
    author: {
      type: 'text',
    },
    published_date: {
      type: 'date',
    },
    price: {
        type: 'numeric(10,2)',
      },
    stock: {
      type: 'integer',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }, 
    created_by: {
      type: 'text', 
    },
  });
}

exports.down = (pgm) => {
    pgm.dropTable('books');
}