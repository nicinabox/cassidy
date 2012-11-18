class window.DomainView extends Backbone.View
  tagName: 'li'
  template: _.template $('#recent-domain-template').html()
  events:
    'click .remove': 'clear'
    'click .domain': 'load'

  initialize: ->
    @model.on('change', @render, this);
    @model.on('destroy', @remove, this);

  render: (html) ->
    this.$el.html @template @model.toJSON()
    this

  clear: (e) ->
    e.preventDefault();
    @model.destroy()

  load: (e) ->
    e.preventDefault()
    app.SwipeView.swipe.next()
    $("#domain").val @model.get 'url'
    app.SecretView.render(@model)
    $('#secret')[0].setSelectionRange 0, 999