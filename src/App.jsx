import { useState, useEffect } from 'react'

function App() {
  const [pokemon, setPokemon] = useState([])
  const [options, setOptions] = useState([])
  const [message, setMessage] = useState('')
  const [correct, setCorrect] = useState(false)
  const [victory, setVictory] = useState(false)
  const [score, setScore] = useState(0)
  
  const fetchPokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    const data = await response.json()
    setPokemon(data)
    const newOptions = await generateOptions(data.name)
    setOptions(newOptions)
    setCorrect(false)
    setMessage('')
    }

  const fetchPokemonName = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await response.json()
    return data.name
  }

  const generateOptions = async (correctName) => {
    const options = new Set([correctName])
    while (options.size < 4) {
      const randomId = Math.floor(Math.random() * 151) + 1
      const name = await fetchPokemonName(randomId)
      options.add(name)
    }
    return Array.from(options).sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    fetchPokemon();
  }, [])

  const handleGuess = (guess) => {
    if (guess === pokemon.name) {
      setCorrect(true)
      setMessage(`¡Correct! is ${pokemon.name}`)
      const newScore = score + 1
      setScore(newScore)
      if (newScore === 10) {
        setVictory(true)
      } 
    }else {
        setMessage('¡Incorrect!')
      }
    
  }

  const handleEventReset = () => {
    setScore(0)
    setVictory(false)
    fetchPokemon()
  }


  return (
    <main className='min-h-screen w-screen px-4 bg-slate-200 relative uppercase py-20'>
     <section className="container mx-auto flex flex-col align-middle justify-center items-center gap-8">
     <h2 className='text-slate-600 text-4xl lg:text-5xl font-bold text-center'>Who's That Pokemon</h2>
      <h2 className='border-2 rounded border-slate-600 text-slate-600 px-6 py-2 font-bold text-sm lg:text-base max-w-[300px] text-center'>Correct Guesses: {score} / 10</h2>
      {victory ? (
        <div className='flex flex-col items-center justify-center gap-4 rounded-xl px-12 py-8 text-center mx-5 bg-[#3D7666] shadow-md shadow-[#305d50]'>
          <h2 className='text-l font-normal text-slate-50'>¡Congratulations! You have guesses 10 correct Pokémon.</h2>
          <button onClick={handleEventReset} className='bg-[#0A464F] shadow-sm shadow-[#0A464F] px-8 py-2 text-white uppercase rounded hover:opacity-85' >Restart</button>
        </div>
      ) : (
        pokemon ? (
          <div className='flex flex-col items-center justify-center gap-6'>
            <div className='relative m-10'>
              <div className='w-80 h-80 bg-blue-300 absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] rounded-full opacity-70'></div>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}  style={{filter: correct ? 'none' : 'brightness(0)'}} className='h-60 max-h-60 relative z-10'/>
            </div>
            <div className='flex flex-col gap-4 items-center'>
                {correct ? (
                  <p className='font-normal text-base lg:text-lg bg-[#9EB4A9] text-slate-50 px-10 py-4 rounded text-center' style={{background: correct ? '#3D7666' : '#D01845'}}>{message}</p>
                ) : (
                  <div className='flex flex-col gap-2'>
                    {options.map((option, index) => (
                      <button key={index} onClick={() => handleGuess(option)} disabled={correct} className='bg-blue-500 text-slate-50 w-[300px] py-2 rounded-lg uppercase text-sm lg:text-normal'>
                        {option}
                      </button>
                    ))}
                    {message && <p className='font-normal text-sm lg:text-base bg-[#bc413f] text-center text-slate-50 px-10 py-2 rounded-lg' style={{background: correct ? '#3D7666' : '#D01845'}}>{message}</p>}
                  </div>
                )}
              </div>
            {correct && <button className='bg-slate-500 px-8 py-2 text-slate-50 uppercase rounded hover:opacity-85' onClick={fetchPokemon}>Next</button>}
          </div>
        ) : (<p>Loading...</p>)
      )}
      <p className='absolute bottom-6 text-slate-600 tracking-widest text-sm'>Made by <a href="https://github.com/PykeMG" target='_blank'>PykeMG</a> in 2024</p>
     </section>
    </main>
  )
}

export default App
