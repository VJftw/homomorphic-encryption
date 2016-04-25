<?php

namespace AppBundle\Resolver;

use AppBundle\Entity\Computation;
use AppBundle\Provider\ComputationProvider;

/**
 * Class ComputationResolver.
 */
class ComputationResolver
{
    /**
     * @var ComputationProvider
     */
    private $computationProvider;

    /**
     * @param ComputationProvider $computationProvider
     */
    public function __construct(ComputationProvider $computationProvider)
    {
        $this->computationProvider = $computationProvider;
    }

    /**
     * @param array $arr
     * @param $ipAddress
     *
     * @return Computation
     */
    public function fromArrayAndIpAddress(array $arr, $ipAddress)
    {
        $computation = $this->computationProvider->createComputation();

        $computation
            ->setEncryptionScheme($arr['encryptionScheme'])
            ->setIpAddress($ipAddress)
        ;

        return $computation;
    }
}
