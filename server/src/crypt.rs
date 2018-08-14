//extern crate crypto;
//extern crate rand;

use crypto::{ symmetriccipher, buffer, aes, blockmodes };
use crypto::buffer::{ ReadBuffer, WriteBuffer, BufferResult };

use rand::{ Rng, OsRng };

use data_encoding::HEXLOWER;


type EncryptResult = Result<Vec<u8>, symmetriccipher::SymmetricCipherError> ;

struct Crypt   {
        pub key : String ,
        pub iv  : String ,
}

impl Crypt  {
    pub fn new( key_string: String, iv_string: String) -> Self{
        // iv_string must be 16 bytes long
        let iv_string = & (iv_string.to_owned() + "01234567891bcdef") ; //pad the input to 16 bytes
        let mut iv_string= iv_string.to_string() ;
        iv_string.truncate(16); 
        debug!("201808130020 iv_string={}", iv_string) ;
        Crypt { key: key_string, iv: iv_string, } 
    }

    pub fn encrypt(&self, data: &[u8]) -> String {
        let encrypted = encrypt(data, self.key.as_bytes(), self.iv.as_bytes()).unwrap() ;
        debug!("201808122337 encrypted {:?}", encrypted);
        let encoded= HEXLOWER.encode(&encrypted)  ;
        debug!("201808122337 encoded={}", encoded);
        encoded
    }
    pub fn decrypt(&self, encoded: &[u8]) -> String {
        let decoded = HEXLOWER.decode(encoded).unwrap() ;
        debug!("201808122338 decoded={:?}", decoded);
        let decrypted =decrypt(&decoded ,self.key.as_bytes(), self.iv.as_bytes()) .unwrap()  ;
        debug!("201808122339 decrypted ");
        String::from_utf8(decrypted) .unwrap()
    }
}


// Encrypt a buffer with the given key and iv using
// AES-256/CBC/Pkcs encryption.
fn encrypt(data: &[u8], key: &[u8], iv: &[u8]) -> EncryptResult {

    // Create an encryptor instance of the best performing
    // type available for the platform.
    let mut encryptor = aes::cbc_encryptor(
            aes::KeySize::KeySize256,
            key,
            iv,
            blockmodes::PkcsPadding);

    let mut final_result = Vec::<u8>::new();
    let mut read_buffer = buffer::RefReadBuffer::new(data);
    let mut buffer = [0; 4096];
    let mut write_buffer = buffer::RefWriteBuffer::new(&mut buffer);

    loop {
        let result = try!(encryptor.encrypt(&mut read_buffer, &mut write_buffer, true));

        // "write_buffer.take_read_buffer().take_remaining()" means:
        // from the writable buffer, create a new readable buffer which
        // contains all data that has been written, and then access all
        // of that data as a slice.
        final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));

        match result {
            BufferResult::BufferUnderflow => break,
            BufferResult::BufferOverflow => { }
        }
    }

    Ok(final_result)
}

fn decrypt(encrypted_data: &[u8], key: &[u8], iv: &[u8]) -> EncryptResult {
    let mut decryptor = aes::cbc_decryptor(
            aes::KeySize::KeySize256,
            key,
            iv,
            blockmodes::PkcsPadding);

    let mut final_result = Vec::<u8>::new();
    let mut read_buffer = buffer::RefReadBuffer::new(encrypted_data);
    let mut buffer = [0; 4096];
    let mut write_buffer = buffer::RefWriteBuffer::new(&mut buffer);

    loop {
        let result = try!(decryptor.decrypt(&mut read_buffer, &mut write_buffer, true));
        final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));
        match result {
            BufferResult::BufferUnderflow => break,
            BufferResult::BufferOverflow => { }
        }
    }

    Ok(final_result)
}



#[cfg(test)]
mod tests {
use crypto::{ symmetriccipher, buffer, aes, blockmodes };
use crypto::buffer::{ ReadBuffer, WriteBuffer, BufferResult };

use rand::{ Rng, OsRng };
use crypt::encrypt;
use crypt::decrypt;
use crypt::Crypt;
    #[test]
    pub fn encrypt_decrypt() {
        let message = "Hello World!";

        let mut key: [u8; 32] = [0; 32];
        let mut iv: [u8; 16] = [0; 16];
    
        // In a real program, the key and iv may be determined
        // using some other mechanism. If a password is to be used
        // as a key, an algorithm like PBKDF2, Bcrypt, or Scrypt (all
        // supported by Rust-Crypto!) would be a good choice to derive
        // a password. For the purposes of this example, the key and
        // iv are just random values.
        let mut rng = OsRng::new().ok().unwrap();
        rng.fill_bytes(&mut key);
        rng.fill_bytes(&mut iv);
    
        let encrypted_data = encrypt(message.as_bytes(), &key, &iv).ok().unwrap();
        let decrypted_data = decrypt(&encrypted_data[..], &key, &iv).ok().unwrap();
    
        assert!(message.as_bytes() == &decrypted_data[..]);
    }

    pub fn fixed_key() {
        use util;
        util::logger_init() ;
        let message = "Hello World!";

        //let mut key: [u8; 32] = [0; 32];
        //let mut iv: [u8; 16] = [0; 16];
    
        // In a real program, the key and iv may be determined
        // using some other mechanism. If a password is to be used
        // as a key, an algorithm like PBKDF2, Bcrypt, or Scrypt (all
        // supported by Rust-Crypto!) would be a good choice to derive
        // a password. For the purposes of this example, the key and
        // iv are just random values.
        //let mut rng = OsRng::new().ok().unwrap();
        //rng.fill_bytes(&mut key);
        //rng.fill_bytes(&mut iv);

        let key_string ="WeihanLin";
        let iv_string  ="Weihan0123456789"; //make it 16 bytes long as in example. test will fail if not 16 bytes
        let key = key_string.as_bytes();
        let iv = iv_string.as_bytes();
    
        let encrypted_data = encrypt(message.as_bytes(), &key, &iv).ok().unwrap();
        debug!("fixed_key encrypted_data={:?}", encrypted_data) ;
        let decrypted_data = decrypt(&encrypted_data[..], &key, &iv).ok().unwrap();
        debug!("fixed_key decrypted_data={:?}", decrypted_data) ;
    
        assert!(message.as_bytes() == &decrypted_data[..]);
    }

    #[test]
    pub fn new_crypt() {
        let key_string ="WeihanLin".to_string();
        let iv_string  ="Weihan".to_string(); //make it 16 bytes long as in example. test will fail if not 16 bytes
        Crypt::new(key_string,iv_string);
    }

    #[test]
    fn encrypt_de()
    {
        use data_encoding::HEXLOWER;
        use util;
        util::logger_init() ;
        let clear_text= "Hello World!" ;
        assert!(String::from_utf8(HEXLOWER.decode(HEXLOWER.encode(clear_text.as_bytes()).as_bytes()).unwrap()).unwrap() == clear_text) ;
        let key_string ="WeihanLin".to_string();
        let iv_string  ="Weihan".to_string();
        let crypt = Crypt::new(key_string,iv_string);
        let encrpted =crypt.encrypt(clear_text.as_bytes());
        let decrypted =crypt.decrypt(encrpted.as_bytes()) ;
        //assert!(clear_text==decrypted);
    }
}
