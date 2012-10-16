DomainView = Backbone.View.extend(
  el: $('#recent_domains ul')
  events:
    'click .remove': 'clear'
    'click .domain': 'load'

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
        "<li data-id='#{d.id}'> \
          <a href='##{d.url}' class='domain'>
            #{d.url}
          </a> \
          <a href='#remove' class='remove'>&times;</a>
        </li>"
      )
    )

  clear: (e) ->
    e.preventDefault();
    id = $(e.currentTarget).parent().data('id')
    item = App.Domains.get(id)
    item.destroy()

  load: (e) ->
    e.preventDefault()
    App.AppView.render $(e.currentTarget).parent().data('id')
    Swipe.next()
)

App.DomainView = new DomainView