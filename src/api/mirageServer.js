import { createServer, Model, Factory, RestSerializer } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    serializers: { application: RestSerializer },
    models: { order: Model, user: Model },

    factories: {
      order: Factory.extend({
        type() { return Math.random() > 0.5 ? 'consumables' : 'others' },
        status() { return 'pending' },
        createdAt() { return new Date().toISOString() },
        items() {
          return [ { id: 'i1', name: 'Sample Item', qty: 2, note: '' } ]
        }
      })
    },

    seeds(server) {
      server.create('user', { id: 'u-admin', name: 'Admin', role: 'admin' })
      server.create('user', { id: 'u-manager', name: 'Manager', role: 'manager' })
      server.create('user', { id: 'u-buyer-c', name: 'BuyerConsum', role: 'buyer', buyerType: 'consumables' })
      server.create('user', { id: 'u-buyer-o', name: 'BuyerOther', role: 'buyer', buyerType: 'others' })

      server.createList('order', 3)
    },

    routes() {
      this.namespace = 'api'

      this.get('/orders', (schema, request) => {
        const type = request.queryParams.type
        const createdBy = request.queryParams.createdBy
        let orders = schema.orders.all().models
        if (type) orders = orders.filter(o => o.type === type)
        if (createdBy) orders = orders.filter(o => o.createdBy === createdBy)
        return { orders }
      })

      this.get('/orders/:id', (schema, request) => schema.orders.find(request.params.id))

      this.post('/orders', (schema, request) => {
        const attrs = JSON.parse(request.requestBody)
        attrs.createdAt = new Date().toISOString()
        attrs.status = 'pending'
        return schema.orders.create(attrs)
      })

      this.put('/orders/:id', (schema, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const order = schema.orders.find(id)
        return order.update(attrs)
      })

      this.del('/orders/:id', (schema, request) => schema.orders.find(request.params.id).destroy())

      this.get('/users', (schema) => schema.users.all())

      this.passthrough()
    }
  })
}
