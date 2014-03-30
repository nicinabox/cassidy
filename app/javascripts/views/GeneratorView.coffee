class App.GeneratorView extends Backbone.View
  template: JST['generator']
  id: 'generator'
  className: 'col-sm-6 col-sm-push-4'

  events:
    'submit form': 'saveService'

  render: ->
    @$el.html @template()
    @el

  saveService: (e) ->
    e.preventDefault()
    data = _.merge $(e.target).serializeObject(),
              settings: App.views.settings.model.attributes

    model = App.collections.services.where(service: data.service)[0]

    if model
      model.save(data)
    else
      model = App.collections.services.create data

      # Rollback
      unless model.isValid()
        model.destroy()
