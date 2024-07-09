import { useState, useEffect, useRef } from 'react'

function App() {
  const [pokemon, setPokemon] = useState([])
  const [guesses, setGuesses] = useState([])
  const [message, setMessage] = useState('')
  const [correct, setCorrect] = useState(false)
  const inputRefs = useRef([])
  const [victory, setVictory] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const fetchPokemon = async () => {
    setIsLoading(true)
    const randomId = Math.floor(Math.random() * 151) + 1
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    const data = await response.json()
    setPokemon(data)
    setCorrect(false)
    setMessage('')
    setGuesses(Array(data.name.length).fill(''))
    setIsLoading(false)
  }

  const handleGuessChange = (index, value) => {
    if (value.length > 1) return;
    const newGuesses = [...guesses]
    newGuesses[index] = value.toLowerCase()
    setGuesses(newGuesses)
    if (value && index < guesses.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleGuessSubmit = (e) => {
    e.preventDefault()
    const guessesName = guesses.join('')
    if (guessesName.toLowerCase() === pokemon.name.toLowerCase()){
      setCorrect(true)
      setMessage(`¡Correct! is ${pokemon.name}`)
      const newScore = score + 1
      setScore(newScore)
      if(newScore === 10){
        setVictory(true)
      }
    } else {
      setMessage('¡Incorrect!')
      setGuesses(Array(pokemon.name.length).fill(''));
      inputRefs.current[0].focus();
    }
  }

  const handleEventReset = () => {
    setScore(0)
    setVictory(false)
    fetchPokemon()
  }

  useEffect(() => {
    fetchPokemon();
  }, [])

  return (
    <main className='h-screen w-screen flex flex-col align-middle justify-center items-center bg-slate-200 gap-8 relative uppercase'>
      <h2 className='text-slate-600 text-5xl font-bold text-center'>Who's That Pokemon</h2>
      <h2 className='border-2 rounded border-slate-600 text-slate-600 px-6 py-2 font-bold'>Correct Guesses: {score} / 10</h2>
      {victory ? (
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl px-12 py-8 text-center mx-5 bg-[#3D7666] shadow-md shadow-[#305d50]'>
          <h2 className='text-l font-normal text-slate-50'>¡Congratulations! You have guesses 10 correct Pokémon.</h2>
          <button onClick={handleEventReset} className='bg-[#0A464F] shadow-sm shadow-[#0A464F] px-8 py-2 text-white uppercase rounded hover:opacity-85' >Restart</button>
        </div>
      ) : (
        pokemon ? (
          <div className='flex flex-col items-center justify-center gap-10'>
            <div className='relative m-10'>
              <div className='w-80 h-80 bg-blue-300 absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] rounded-full opacity-70'></div>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}  style={{filter: correct ? 'none' : 'brightness(0)'}} className='h-60 max-h-60 relative z-10'/>
            </div>
            <form onSubmit={handleGuessSubmit} className='flex flex-col gap-4 items-center'>
              <div className='flex xl:gap-3 gap-1'>
                {guesses.map((guess, index) => (
                  <input className='border-2 w-8 h-8 rounded xl:w-9 xl:h-9 bg-slate-100 text-center border-slate-500 uppercase' type="text" key={index} value={guess} onChange={(e) => handleGuessChange(index, e.target.value)} maxLength="1" disabled={correct} ref={(el) => (inputRefs.current[index] = el)} placeholder='?'/>
                ))}
              </div>
              {!correct && <button className='bg-slate-500 px-8 py-2 text-white uppercase rounded hover:opacity-85' type='submit' disabled={correct}>Guess</button>}
            </form>
            {message && <p className='font-normal text-lg bg-[#9EB4A9] text-slate-50 px-20 py-4 rounded' style={{background: correct ? '#3D7666' : '#D01845'}}>{message}</p>}
            {correct && <button className='bg-slate-500 px-8 py-2 text-slate-50 uppercase rounded hover:opacity-85' onClick={fetchPokemon}>Next</button>}
          </div>
        ) : (<p>Loading...</p>)
      )}
      <p className='absolute bottom-6 text-slate-600 tracking-widest text-sm'>Made by <a href="https://github.com/PykeMG" target='_blank'>PykeMG</a> in 2024</p>
    </main>
  )
}

export default App
