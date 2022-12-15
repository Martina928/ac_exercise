// define sample function to randomly return an item ina an array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

// define generatePassword function
function generatePassword() {
  // define things user might want
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const symbols = '`~!@$%^&*()-_+={}[]|;:"<>,.?/'

  // define dummy data
  const options = {
    length: 12,
    lowercase: 'on',
    uppercase: 'on',
    numbers: 'on',
    excludeCharacters: '40'
  }

  console.log('options', options)

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

  console.log('collection', collection)

  // remove things user do not need
  if (options.excludeCharacters) {
    console.log(`exclude characters: ${options.excludeCharacters}`)
    collection = collection.filter(
      character => !options.excludeCharacters.includes(character)
    )
  }
  console.log('collection', collection)

  // start generating password
  let password = ''
  for (let i = 0; i < Number(options.length); i++) {
    password += sample(collection)
  }

  // return the generated password
  console.log('password', password)
  return password
}

// invoke generatePassword function
generatePassword()
