import React from 'react';

const GoogleMapEmbed = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        borderRadius: '10px',
      }}
    >
      <iframe
        title="Map SMK NEGERI 2 DEPOK"
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.1587982564065!2d110.38934107455377!3d-7.772980277108262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a583a61290129%3A0x668d51a34b3a7ee8!2sSMK%20Negeri%202%20Depok%20-%20Sleman!5e0!3m2!1sen!2sid!4v1733673179657!5m2!1sen!2sid'
        width='100%'
        height='100%'
        style={{ border: 0, borderRadius: '12px' }}
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </div>
  );
};

export default GoogleMapEmbed;
