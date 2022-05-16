export async function timeout(timeoutMs = 0) {
  return new Promise((res) => setTimeout(res, timeoutMs));
}
