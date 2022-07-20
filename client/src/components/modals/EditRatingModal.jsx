import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateReview } from '../../api/review';
import { useNotification } from '../../hooks';
import { getToken } from '../../redux/selector';
import { parseError } from '../../utils/helper';
import RatingForm from '../form/RatingForm';
import ModalContainer from './ModalContainer';

export default function EditRatingModal({ visible, onClose, onSuccess, initialState }) {
  const [loading, setLoading] = useState(false);
  const token = useSelector(getToken);
  const { updateNotification } = useNotification();
  const handleSubmit = async (data) => {
    try {
      setLoading(true);

      const { message } = await updateReview(initialState.id, data, token);

      updateNotification('success', message);
      setLoading(false);
      onSuccess && onSuccess({...data});
      onClose();
    } catch (error) {
      setLoading(false);
      updateNotification('error', parseError(error));
      onClose();
    }
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm initialState={initialState} onSubmit={handleSubmit} loading={loading} />
    </ModalContainer>
  );
}
