import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerTag } from '../../state/PlayerTagContext.jsx'
import heroImage from '../../assets/Blue-Kings-Jumping.png'
import styles from './Overview.module.css'

function Overview() {
  const navigate = useNavigate()
  const [showTagModal, setShowTagModal] = useState(false)
  const {
    playerTag,
    setPlayerTag,
    currentPlayer,
    isLoadingPlayer,
    playerError,
    loadPlayerForTag,
  } = usePlayerTag()

  const handlePlayerTagChange = (event) => {
    setPlayerTag(event.target.value)
  }

  const handlePlayerTagSubmit = (event) => {
    event.preventDefault()
    loadPlayerForTag(playerTag)
  }

  const handleClearPlayerTag = () => {
    setPlayerTag('')
    loadPlayerForTag('')
  }

  const handleExploreDecks = () => {
    if (!playerTag) {
      setShowTagModal(true)
    } else {
      navigate('/decks/explore')
    }
  }

  const handleModalEnterTag = () => {
    setShowTagModal(false)
    // Focus will naturally go to the input field
    const input = document.getElementById('player-tag-input')
    if (input) {
      setTimeout(() => input.focus(), 100)
    }
  }

  const handleModalSkip = () => {
    setShowTagModal(false)
    navigate('/decks/explore')
  }

  const headingText = currentPlayer?.name
    ? `Welcome ${currentPlayer.name}`
    : 'Welcome to Clash Cache'

  return (
    <section className={`${styles.section}`}>
      <div className={styles.contentColumn}>
        <div className={styles.contentInner}>
          <h1 className={styles.heading}>{headingText}</h1>
          <p className={styles.lead}>Your Clash Royale companion app</p>
          <form onSubmit={handlePlayerTagSubmit} className={styles.form}>
            <label htmlFor="player-tag-input" className={styles.label}>
              Player Tag
            </label>
            <input
              id="player-tag-input"
              type="text"
              className={styles.input}
              placeholder="Enter your player tag (e.g. #90YY2G00)"
              value={playerTag}
              onChange={handlePlayerTagChange}
            />
            <button type="submit" className={styles.submitButton} disabled={isLoadingPlayer}>
              {isLoadingPlayer ? 'Loading...' : 'Load Player'}
            </button>
            {playerTag && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClearPlayerTag}
                disabled={isLoadingPlayer}
              >
                Clear Player Tag
              </button>
            )}
            {playerError ? (
              <div className={styles.error}>
                {playerError}
              </div>
            ) : null}
          </form>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleExploreDecks}
            style={{ marginTop: 'var(--spacing-lg)', width: '100%' }}
          >
            Explore Decks
          </button>
        </div>
      </div>
      <div className={`${styles.heroColumn} mobile-hidden`}>
        <img src={heroImage} alt="Blue King jumping into battle" className={`${styles.heroImage}`} />
      </div>
      {showTagModal && (
        <div className={styles.modalOverlay} onClick={handleModalSkip}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Enter Player Tag</h2>
            <p className={styles.modalMessage}>
              For the best experience exploring decks, we recommend entering your player tag. 
              This allows us to show you optimized deck suggestions based on your card levels.
            </p>
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleModalEnterTag}
              >
                Enter Tag
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleModalSkip}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Overview


