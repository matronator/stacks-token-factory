;; Implement the `ft-trait` trait defined in the `ft-trait` contract
(impl-trait .ft-trait.sip-010-trait)
;; (impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(define-constant TOTAL_SUPPLY u420000000000000)

(define-fungible-token token-name TOTAL_SUPPLY)

(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_MINT_MORE_THAN_MAX (err u102))

(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Token Name")
(define-constant TOKEN_SYMBOL "SYM")
(define-constant TOKEN_DECIMALS u0) ;; 6 units displayed past decimal, e.g. 1.000_000 = 1 token
(define-constant MAX_MINT_AMOUNT u100000)

(define-data-var token-uri (string-utf8 256) u"https://asdf.com") ;; utf-8 string with token metadata host

;; get the token balance of owner
(define-read-only (get-balance (owner principal))
  (begin
    (ok (ft-get-balance token-name owner))))

;; returns the total number of tokens
(define-read-only (get-total-supply)
  (ok (ft-get-supply token-name)))

;; returns the token name
(define-read-only (get-name)
  (ok TOKEN_NAME))

;; the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL))

;; the number of decimals used
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS))

;; Transfers tokens to a recipient
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
)
  (begin
    ;; #[filter(amount, recipient)]
    (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
    (try! (ft-transfer? token-name amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-token-uri)
  (ok (some (var-get token-uri))))

;; #[allow(unchecked_data)]
(define-public (set-token-uri (uri (string-utf8 256)))
  (if (is-eq tx-sender CONTRACT_OWNER)
    (begin
      (var-set token-uri uri)
      (ok true))
    (err ERR_NOT_TOKEN_OWNER)))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (is-eq recipient tx-sender) ERR_NOT_TOKEN_OWNER)
    (asserts! (<= amount MAX_MINT_AMOUNT) ERR_MINT_MORE_THAN_MAX)
    (ft-mint? token-name amount recipient)
  )
)

;; Mint this token to a few people when deployed
(ft-mint? token-name TOTAL_SUPPLY tx-sender)
