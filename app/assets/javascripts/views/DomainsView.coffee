class window.DomainsView extends Backbone.View
  el: $('#recent_domains')

  initialize: ->
    app.Domains.on('add', @addDomain, this)
    app.Domains.on('reset', @addAllDomains, this)
    app.Domains.fetch()

  addDomain: (domain) ->
    view = new DomainView
      model: domain
    this.$('ul').append view.render().el

  addAllDomains: ->
    if app.Domains.length
      this.$el.find('.no-results').hide()
      app.Domains.each @addDomain