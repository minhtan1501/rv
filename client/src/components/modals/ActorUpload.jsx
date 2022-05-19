import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ActorForm from '../form/ActorForm';
import ModalContainer from './ModalContainer';
import { createActor } from '../../api/actor';
import { useNotification } from '../../hooks';
import {getToken } from '../../redux/selector'
export default function ActorUpload({ visible, onClose }) {
  const { updateNotification } = useNotification();
  const [loadding, setLoading] = useState(false);
  const token = useSelector(getToken);
  const handleSubmitActor = async (data) => {
    try {
      setLoading(true);
      const { actor } = await createActor(data, token);
      updateNotification('success', 'Actor created successfully');
      onClose();
      setLoading(false);
    } catch (error) {
      updateNotification('error', error.message || error);
      onClose();
      setLoading(false);
    }
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        loadding={loadding}
        onSubmit={handleSubmitActor}
        title="Create new Actor"
        btnTitle="Create"
      />
    </ModalContainer>
  );
}
