class App.SuggestionsView extends Backbone.View
  template: JST['suggestions']
  id: 'suggestions'

  initialize: ->
    @collection = App.collections.services
    @items = @collection.top(6)
    @listenTo @collection, 'change sync', ->
      @items = @collection.top(6)
      @render()

  render: ->
    if @items.length
      @addAll()
      @$el.html @template()
      @$el.append @fragment
    @el

  addOne: (model) ->
    view = new App.ServiceView model: model
    view.$el.tooltip
      title: "Used #{model.get('usage')} #{_.pluralize(model.get('usage'), 'time/times')}"
      placement: 'bottom'
    @fragment.appendChild view.render()

  addAll: ->
    @fragment = @createFragment()
    _.each @items, @addOne, this

  createFragment: ->
    document.createDocumentFragment()
