<?php

namespace AppBundle\Finisher;

use AppBundle\Entity\Computation;
use Hashids\HashGenerator;
use Symfony\Component\Security\Core\Util\SecureRandomInterface;

/**
 * Class ComputationFinisher
 * @package AppBundle\Finisher
 */
class ComputationFinisher
{

    /**
     * @var HashGenerator
     */
    private $hashGenerator;

    /**
     * @var SecureRandomInterface
     */
    private $secureRandom;

    /**
     * @param HashGenerator $hashGenerator
     * @param SecureRandomInterface $secureRandom
     */
    public function __construct(
        HashGenerator $hashGenerator,
        SecureRandomInterface $secureRandom
    ) {
        $this->hashGenerator = $hashGenerator;
        $this->secureRandom = $secureRandom;
    }

    /**
     * @param Computation $computation
     *
     * @return Computation
     */
    public function finishComputation(Computation $computation)
    {
        $hashId = $this->hashGenerator->encode(
            $computation->getTimestamp()
                ->getTimestamp()
        );

        $computation
            ->setHashId($hashId)
        ;

        return $computation;
    }
}
