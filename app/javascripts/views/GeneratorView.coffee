class App.GeneratorView extends Backbone.View
  template: JST['generator']
  id: 'generator'
  className: 'col-sm-6 col-sm-offset-1'

  events:
    'submit form': 'saveService'

  render: ->
    @$el.html @template()
    @el

  saveService: (e) ->
    e.preventDefault()
    data = $(e.target).serializeObject()
    model = App.collections.services.create data

    # Rollback
    unless model.isValid()
      model.destroy()
