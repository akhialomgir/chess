import './App.css'
import Chessboard from './components/Chessboard.tsx'

export default function App() {

  return (
    <>
      <div className='game-box'>
        <Chessboard />
        <div className='chess-move'>
          <ol>
            <li>e4</li>
          </ol>
        </div>
      </div>
    </>
  )
}

