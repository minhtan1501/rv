import React, { useEffect, useState } from 'react'
import { getActorProfile } from '../../api/actor'
import ModalContainer from './ModalContainer'
import {useNotification} from '../../hooks'
import {parseError} from '../../utils/helper'
export default function ProfileModal({visible,profileId,onClose}) {
    const [profile,setProfile] = useState({})   
    const {updateNotification} = useNotification()
    const fetchActorProfile = async() =>{
      try {
        const {actor} = await getActorProfile(profileId);
        setProfile(actor)
      } catch (error) {
        updateNotification('error', parseError(error));
      }
    }

    useEffect(() => {
      fetchActorProfile()
    },[profileId])

    const {avatar,name,about} = profile

    return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className="space-y-3 p-5 rounded bg-white dark:bg-primary flex flex-col items-center">
        <img className="w-28 h-28 rounded-full" src={avatar} alt="" />
        <h1 className="dark:text-white text-primary font-semibold">{name}</h1>
        <p className="
        dark:text-dark-subtle text-light-subtle 
        max-h-40 overflow-auto 
        max-w-lg border-2
        dark:border-white border-secondary
        custom-scroll-bar p-1">{about}</p>
      </div>
    </ModalContainer>
  )
}
