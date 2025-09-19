import Image from 'next/image';

const MdxImage = (props: any) => {
  return <Image {...props} alt={props.alt} />;
};

export default MdxImage;
