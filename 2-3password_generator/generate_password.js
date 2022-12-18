// define sample function to randomly return an item ina an array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

// define generatePassword function
function generatePassword(options) {
  // define things user might want
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const symbols = '`~!@$%^&*()-_+={}[]|;:"<>,.?/'

  // create a collection to store things user picked up
  let collection = []

  // ... spread syntax
  if (options.lowercase === 'on') {
    collection = collection.concat([...lowerCaseLetters])
    // collection = collection.concat(lowerCaseLetters.split(''))
  }

  if (options.uppercase === 'on') {
    collection = collection.concat([...upperCaseLetters])
  }

  if (options.numbers === 'on') {
    collection = collection.concat([...numbers])
  }

  if (options.symbols === 'on') {
    collection = collection.concat([...symbols])
  }

  // remove things user do not need
  if (options.excludeCharacters) {
    console.log(`exclude characters: ${options.excludeCharacters}`)
    collection = collection.filter(
      character => !options.excludeCharacters.includes(character)
    )
  }

  // return error message if collection is empty
  if (collection.length === 0) {
    return `There is no valid character in your selection.`
  }

  // start generating password
  let password = ''
  for (let i = 0; i < Number(options.length); i++) {
    password += sample(collection)
  }

  // return the generated password
  return password
}

// export generatePassword function for other files to use
module.exports = generatePassword
