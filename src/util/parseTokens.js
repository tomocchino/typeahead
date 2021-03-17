// TODO: This is a dramatically oversimplified implementation of this function
// Still need to deal with punctuation, accents, and special characters
export default function parseTokens(text) {
  return text.toLocaleLowerCase().split(" ");
}
