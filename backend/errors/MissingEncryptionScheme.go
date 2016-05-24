package errors

type MissingEncryptionScheme string

func (e MissingEncryptionScheme) Error() string {
	return "Missing Encryption Scheme"
}
