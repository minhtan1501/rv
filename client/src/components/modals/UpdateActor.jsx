import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { updateActor } from '../../api/actor';
import { useNotification } from '../../hooks';
import { getToken } from '../../redux/selector';
import ActorForm from '../form/ActorForm';
import ModalContainer from './ModalContainer';
export default function UpdateActor({
  visible,
  initialState,
  onSuccess,
  onClose,
}) {
  const { updateNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const token = useSelector(getToken);
  const handleSubmitActor = async (data) => {
    try {
      setLoading(true);
      const { actor } = await updateActor(data, initialState.id, token);
      updateNotification('success', 'Actor updated successfully');
      onClose();
      setLoading(false);
      onSuccess(actor);
    } catch (error) {
      updateNotification('error', error.message || error);
      onClose();
      setLoading(false);
    }
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        loading={loading}
        onSubmit={handleSubmitActor}
        title="Update Actor"
        btnTitle="Update"
        initialState={initialState}
      />
    </ModalContainer>
  );
}
