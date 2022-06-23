import React from 'react'

const Rating = ({ rating, reviews, caption }) => {
  return (
    <div className='rating'>
      <span>
        <i
          className={
            rating >= 1
              ? 'fas fa-star'
              : rating >= 0.5
              ? 'fas fa-star-half-alt'
              : 'fas fa-star'
          }
        />
        <i
          className={
            rating >= 2
              ? 'fas fa-star'
              : rating >= 1.5
              ? 'fas fa-star-half-alt'
              : 'fas fa-star'
          }
        />
        <i
          className={
            rating >= 3
              ? 'fas fa-star'
              : rating >= 2.5
              ? 'fas fa-star-half-alt'
              : 'fas fa-star'
          }
        />
        <i
          className={
            rating >= 4
              ? 'fas fa-star'
              : rating >= 3.5
              ? 'fas fa-star-half-alt'
              : 'fas fa-star'
          }
        />
        <i
          className={
            rating >= 5
              ? 'fas fa-star'
              : rating >= 4.5
              ? 'fas fa-star-half-alt'
              : 'fas fa-star'
          }
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{' ' + reviews + 'reviews'}</span>
      )}
    </div>
  )
}

export default Rating
