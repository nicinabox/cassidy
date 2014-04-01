class App.Vault extends Vault
  generate_with_key: (service, key) ->
    throw new Error("Length too small to fit all required characters")  if @_required.length > @_length
    throw new Error("No characters available to create a password")  if @_allowed.length is 0

    required = @_required.slice()
    stream = new App.Vault.Stream(@_phrase, service, key, @entropy())
    result = ""
    index = undefined
    charset = undefined
    previous = undefined
    i = undefined
    same = undefined

    while result.length < @_length
      index = stream.generate(required.length)
      charset = required.splice(index, 1)[0]
      previous = result.charAt(result.length - 1)
      i = @_repeat - 1
      same = previous and (i >= 0)
      same = same and result.charAt(result.length + i - @_repeat) is previous  while same and i--
      charset = @subtract([previous], charset.slice())  if same
      index = stream.generate(charset.length)
      result += charset[index]

    result

class App.Vault.Stream extends Vault.Stream
  constructor: (phrase, service, key, entropy) ->
    @_phrase = phrase
    @_service = service

    hash = Vault.createHash(phrase, service + Vault.UUID + key, 2 * entropy)
    bits = Vault.map(hash.split(""), Vault.toBits).join("").split("")

    @_bases = 2: Vault.map(bits, (s) ->
      parseInt s, 2
    )

    return
