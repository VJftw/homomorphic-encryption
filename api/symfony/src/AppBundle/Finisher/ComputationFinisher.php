<?php

namespace AppBundle\Finisher;

use AppBundle\Entity\Computation;
use Hashids\HashGenerator;
use Hashids\Hashids;


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
     * @param HashGenerator $hashGenerator
     */
    public function __construct(
        HashGenerator $hashGenerator
    ) {
        $this->hashGenerator = $hashGenerator;
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

        $authToken = base64_encode(random_bytes(32));

        $computation
            ->setHashId($hashId)
            ->setAuthToken($authToken)
        ;

        return $computation;
    }
}
