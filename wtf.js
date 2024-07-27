let config = {
  envelope: 'envelope',
  zov: 'zov',
  z: undefined
}

let maslo = {
  zov: "ZOV",
  envelope: undefined
}

config = {
  ...config,
  ...maslo
}

console.log(config)