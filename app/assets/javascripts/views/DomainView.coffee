DomainView = Backbone.View.extend(
  el: $('#recent_domains ul')
  events:
    'click .remove': 'clear'

  initialize: ->
    self = this
    _.bindAll(this, 'clear')
    App.Domains.bind('all', @render, this)
    App.Domains.fetch()

  render: ->
    self = this
    domains = App.Domains.toJSON()

    self.el.empty() if domains.length
    _.each(domains, (d) ->
      self.el.append(
        "<li> \
          <a href='##{d.url}' class='domain'>
            #{d.url}
          </a> \
          <a href='#remove' class='remove' data-id='#{d.id}'>&times;</a>
        </li>"
      )
    )

  clear: (e) ->
    e.preventDefault();
    id = $(e.currentTarget).data('id')
    item = App.Domains.get(id)
    item.destroy()
)

App.DomainView = new DomainView