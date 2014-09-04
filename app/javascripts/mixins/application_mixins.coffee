_.mixin
  pluralize: (n, strs, separator = '/') =>
    [singular, plural] = strs.split('/')
    if n == 1 then singular else plural
