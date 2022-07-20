import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addReview } from '../../api/review';
import RatingForm from '../form/RatingForm'
import ModalContainer from './ModalContainer'
import {getToken} from '../../redux/selector'
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';

export default function AddRatingModal({visible, onClose,onSuccess}) {
    const [loading,setLoading] = useState(false);
    const {movieId} = useParams();
    const token = useSelector(getToken);
    const {updateNotification} = useNotification()
    const handleSubmit = async(data) => {
        try {
            
            setLoading(true);
            
            const {message,reviews} = await addReview(movieId, data,token);
            
            updateNotification('success', message);
            setLoading(false);
            onSuccess(reviews)
            onClose()
        } catch (error) {
            setLoading(false);
            updateNotification('error',parseError(error))
            onClose()
        }
    }

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <RatingForm onSubmit={handleSubmit} loading={loading}/>
    </ModalContainer>
  )
}
