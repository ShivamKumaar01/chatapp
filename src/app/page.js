'use client'
import Box from '@mui/material/Box'
import img from '../../src/assets/leaf.png'
import Image from 'next/image'

import SignupForm from '@/component/form'

export default function Signup() {
  return (
    <Box
      component='section'
      sx={{
       
      
        display: 'flex',
        backgroundColor: '#F5F5F5',
        height:'100vh'
       

      }}
    >
      {/* left box for form */}
      <Box
        component='section'
        sx={{ p: 2, width: '50%' }}
      >

        <Box width={'50%'} height={'60%'} marginLeft={'25%'} marginTop={'20%'}>
          <SignupForm></SignupForm>
        </Box>

      </Box>
      {/* right box */}
      <Box
        component='section'
        sx={{ width: '50%', overflowY:'hidden' }}
      >
      
        <Image src={img}style={{ width: '100%',height:'100%' }} objectFit='cover' ></Image>
      </Box>
    </Box>









  //   <Box
  //   component='section'
  //   sx={{
     
      
  //     display: 'flex',
  //     backgroundColor: '#F5F5F5',
  //     height:'100vh'
     

  //   }}
  // >
  //   {/* left box for form */}
  //   <Box
  //     component='section'
  //     sx={{ p: 2, width: '45%' }}
  //   >

  //     <Box width={'70%'}  >
  //       <SignupForm></SignupForm>
  //     </Box>

  //   </Box>
  //   {/* right box */}
  //   <Box
  //     component='section'
  //     sx={{  width: '55%' }}
  //   >
  //     <Image src={img}style={{ width: '100%', height: 'auto' ,objectFit:"cover"}}  ></Image>
  //   </Box>
  // </Box>


  )
}
